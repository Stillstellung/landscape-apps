import { createDevLogger } from '@tloncorp/shared/dist';
import * as api from '@tloncorp/shared/dist/api';
import { SignupParams, signupData } from '@tloncorp/shared/dist/db';
import * as store from '@tloncorp/shared/dist/store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useBootSequence } from '../hooks/useBootSequence';
import { NodeBootPhase } from '../lib/bootHelpers';
import { connectNotifyProvider } from '../lib/notificationsApi';

const logger = createDevLogger('signup', true);

type SignupValues = Omit<SignupParams, 'bootPhase'>;
const defaultValues: SignupValues = {
  hostingUser: null,
  reservedNodeId: null,
};

interface SignupContext extends SignupParams {
  setHostingUser: (hostingUser: { id: string }) => void;
  setNickname: (nickname: string | undefined) => void;
  setNotificationToken: (notificationToken: string | undefined) => void;
  setTelemetry: (telemetry: boolean) => void;
  setDidSignup: (didSignup: boolean) => void;
  setDidCompleteSignup: (value: boolean) => void;
  setOnboardingValues: (newValues: Partial<SignupValues>) => void;
  handlePostSignup: () => void;
  clear: () => void;
}

const defaultMethods = {
  setNickname: () => {},
  setNotificationToken: () => {},
  setTelemetry: () => {},
  setDidSignup: () => {},
  setHostingUser: () => {},
  setDidCompleteSignup: () => {},
  setOnboardingValues: () => {},
  handlePostSignup: () => {},
  clear: () => {},
};

const SignupContext = createContext<SignupContext>({
  ...defaultValues,
  ...defaultMethods,
  bootPhase: NodeBootPhase.IDLE,
});

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  // const [values, setValues] = useState<SignupValues>(defaultValues);
  const {
    value: values,
    setValue: setValues,
    resetValue: resetValues,
  } = signupData.useStorageItem();
  const { bootPhase, bootReport } = useBootSequence(values);

  const isOngoing = useMemo(() => {
    return (
      values.didBeginSignup &&
      (!values.didCompleteSignup || bootPhase !== NodeBootPhase.READY)
    );
  }, [values.didBeginSignup, values.didCompleteSignup, bootPhase]);

  const setOnboardingValues = useCallback(
    (newValues: Partial<SignupValues>) => {
      setValues((current) => ({
        ...current,
        ...newValues,
      }));
    },
    []
  );

  const setDidSignup = useCallback((didBeginSignup: boolean) => {
    setValues((current) => ({
      ...current,
      didBeginSignup,
    }));
  }, []);

  const setDidCompleteSignup = useCallback((value: boolean) => {
    setValues((current) => ({
      ...current,
      didCompleteSignup: value,
      userWasReadyAt: Date.now(),
    }));
  }, []);

  const setHostingUser = useCallback((hostingUser: { id: string }) => {
    setValues((current) => ({
      ...current,
      hostingUser,
    }));
  }, []);

  const setNickname = useCallback((nickname: string | undefined) => {
    setValues((current) => ({
      ...current,
      nickname,
    }));
  }, []);

  const setNotificationToken = useCallback(
    (notificationToken: string | undefined) => {
      setValues((current) => ({
        ...current,
        notificationToken,
      }));
    },
    []
  );

  const setTelemetry = useCallback((telemetry: boolean) => {
    setValues((current) => ({
      ...current,
      telemetry,
    }));
  }, []);

  const clear = useCallback(() => {
    logger.log('clearing signup context');
    resetValues();
  }, []);

  const handlePostSignup = useCallback(() => {
    try {
      logger.log('running post-signup actions');
      const postSignupParams = {
        nickname: values.nickname,
        telemetry: values.telemetry,
        notificationToken: values.notificationToken,
      };
      runPostSignupActions(postSignupParams);
      logger.trackEvent('hosted signup report', {
        bootDuration: bootReport
          ? bootReport.completedAt - bootReport.startedAt
          : null,
        userSatWaitingFor: values.userWasReadyAt
          ? Date.now() - values.userWasReadyAt
          : null,
        timeUnit: 'ms',
      });
    } catch (e) {
      logger.trackError('post signup error', {
        errorMessage: e.message,
        errorStack: e.stack,
      });
    } finally {
      setTimeout(() => clear(), 2000);
    }
  }, [values, bootReport, clear]);

  useEffect(() => {
    if (
      values.didBeginSignup &&
      values.didCompleteSignup &&
      bootPhase === NodeBootPhase.READY
    ) {
      handlePostSignup();
    }
  }, [values, bootPhase, clear, bootReport, handlePostSignup]);

  return (
    <SignupContext.Provider
      value={{
        ...values,
        bootPhase,
        isOngoing,
        setHostingUser,
        setNickname,
        setNotificationToken,
        setTelemetry,
        setDidSignup,
        setDidCompleteSignup,
        setOnboardingValues,
        handlePostSignup,
        clear,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export function useSignupContext() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error('useSignupContext must be used within a SignupProvider');
  }

  return context;
}

async function runPostSignupActions(params: {
  nickname?: string;
  telemetry?: boolean;
  notificationToken?: string;
}) {
  if (params.nickname) {
    try {
      await store.updateCurrentUserProfile({
        nickname: params.nickname,
      });
    } catch (e) {
      logger.trackError('post signup: failed to set nickname', {
        errorMessage: e.message,
        errorStack: e.stack,
      });
    }
  }

  if (typeof params.telemetry !== 'undefined') {
    try {
      await api.updateTelemetrySetting(params.telemetry);
    } catch (e) {
      logger.trackError('post signup: failed to set telemetry', {
        errorMessage: e.message,
        errorStack: e.stack,
      });
    }
  }

  if (params.notificationToken) {
    try {
      await connectNotifyProvider(params.notificationToken);
    } catch (e) {
      logger.trackError('post signup: failed to set notification token', {
        errorMessage: e.message,
        errorStack: e.stack,
      });
    }
  }
}
