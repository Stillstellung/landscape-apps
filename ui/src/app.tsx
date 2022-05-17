import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Location,
  useLocation,
} from 'react-router-dom';
import Groups from './pages/Groups';
import Channel from './pages/Channel';
import { useGroupState } from './state/groups';
import NewGroup from './pages/NewGroup';
import NewChannel from './pages/NewChannel';
import Members from './pages/Members';
import Roles from './pages/Roles';
import { useChatState } from './state/chat';
import ChannelSettings from './pages/ChannelSettings';
import { IS_MOCK } from './api';
import Gang, { GangModal } from './pages/Gang';
import JoinGroup, { JoinGroupModal } from './pages/JoinGroup';

import Sidebar from './components/Sidebar/Sidebar';
import ChatThread from './components/ChatThread/ChatThread';
import Policy from './pages/Policy';
import GroupSidebar from './components/GroupSidebar';
import useMedia from './hooks/useMedia';

function App() {
  const location = useLocation();
  const isMobile = useMedia('(max-width: 639px)');

  useEffect(() => {
    useGroupState.getState().start();
    useChatState.getState().fetchFlags();
  }, []);

  const state = location.state as { backgroundLocation?: Location } | null;

  return (
    <div className="flex h-full w-full">
      <Routes>
        <Route path={isMobile ? '/' : '*'} element={<Sidebar />} />
      </Routes>
      <Routes>
        <Route
          path={isMobile ? '/groups/:ship/:name' : '/groups/:ship/:name/*'}
          element={<GroupSidebar />}
        />
      </Routes>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/gangs/:ship/:name" element={<Gang />} />
        <Route path="/groups/new" element={<NewGroup />} />
        <Route path="/groups/join" element={<JoinGroup />} />
        <Route path="/groups/:ship/:name/*" element={<Groups />}>
          <Route path="members" element={<Members />} />
          <Route path="roles" element={<Roles />} />
          <Route path="policy" element={<Policy />} />
          <Route path="channels/:app/:chShip/:chName/*" element={<Channel />}>
            <Route path="message/:time" element={<ChatThread />} />
          </Route>
          <Route
            path="channels/:app/:chShip/:chName/settings"
            element={<ChannelSettings />}
          />
          <Route path="channels/new" element={<NewChannel />} />
        </Route>
      </Routes>
      {state?.backgroundLocation ? (
        <Routes>
          <Route path="/groups/join" element={<JoinGroupModal />} />
          <Route path="/gangs/:ship/:name" element={<GangModal />} />
        </Routes>
      ) : null}
    </div>
  );
}

function RoutedApp() {
  return (
    <Router basename={IS_MOCK ? '/' : '/apps/homestead'}>
      <App />
    </Router>
  );
}

export default RoutedApp;
