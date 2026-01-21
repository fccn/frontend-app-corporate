import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Hyperlink, Image, Truncate, Row,
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
    <Row>
      {image && (
        <Image
          alt={`${name} logo`}
          src={image}
          className="mr-2 col-lg-3"
        />
      )}
      <Truncate.Deprecated lines={2}>{name}</Truncate.Deprecated>
    </Row>
  </Hyperlink>
);

export const LearnerName = ({ row }) => (
  <span>{row.original.user.fullName}</span>
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
