import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Hyperlink, Image,
  Badge,
} from '@openedx/paragon';
import messages from './messages';

interface CellNameProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  destination?: string;
  image?: null | string;
}

export const CellName = ({
  name, destination, image = null, className,
}: CellNameProps) => (
  <Hyperlink
    className={`d-block ${className || ''} text-body`}
    destination={destination}
    isInline
  >
    <div className="d-flex align-items-center">
      {image && (
        <Image
          alt={`${name} logo`}
          src={image}
          className="mr-2 col-lg-3"
        />
      )}
      <span className="truncate-2-line">{name}</span>
    </div>
  </Hyperlink>
);

export const LearnerName = ({ row }) => (
  <div>
    <span className="d-block truncate-1-line">
      {row.original.user.username}
    </span>
    {(row.original.user.fullName !== row.original.user.username)
      && (
      <span className="small text-muted truncate-1-line">
        {row.original.user.fullName}
      </span>
      )}
  </div>
);

export const LearnerEmail = ({ row }) => (
  <span>{row.original.user.email}</span>
);

export const LearnerStatus = ({ row }) => {
  const intl = useIntl();
  return (
    <Badge
      variant={row.original.active ? 'success' : 'danger'}
    >
      {row.original.active
        ? intl.formatMessage(messages['table.learner.status.active'])
        : intl.formatMessage(messages['table.learner.status.inactive'])}
    </Badge>
  );
};
