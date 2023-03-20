import { getAppHref } from '@/logic/utils';
import { useCharge } from '@/state/docket';
import { useNavigate, useParams } from 'react-router';
import Dialog, { DialogContent } from '../Dialog';
import ArrowNEIcon from '../icons/ArrowNEIcon';
import ArrowNWIcon from '../icons/ArrowNWIcon';
import OpenSmallIcon from '../icons/OpenSmallIcon';

export default function AppModal() {
  const navigate = useNavigate();
  const { desk } = useParams<{ desk: string }>();
  const { href, title, image, color } = useCharge(desk || '');
  const path = getAppHref(href);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate(-1);
    }
  };

  return (
    <Dialog defaultOpen modal onOpenChange={onOpenChange}>
      <DialogContent
        containerClass="w-full h-full rounded-xl pt-0"
        className="mt-7 h-5/6 w-full bg-white px-0 pb-0"
        appModal
      >
        <iframe
          className="mt-6 h-full w-full overflow-y-auto rounded-b-xl border-t-2 border-gray-50 bg-white"
          src={path}
        />
        <div className="absolute -top-2 left-0 m-4 flex items-center justify-center space-x-2">
          {(image || color) && (
            <div
              className="h-8 w-8 items-center justify-center rounded"
              style={{
                backgroundColor: color,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }}
            />
          )}
          {title && <span className="font-semibold text-black">{title}</span>}
        </div>
        <div className="absolute top-1 right-10 flex cursor-pointer items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-50">
          <a
            href={path}
            title="Open in new tab"
            target="_blank"
            rel="noreferrer"
          >
            <ArrowNEIcon className="h-8 w-8" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
