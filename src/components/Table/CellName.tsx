import {
  Hyperlink, Image, Truncate, Row,
} from '@openedx/paragon';

interface CellNameProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  destination?: string;
  image?: null | string;
}

const CellName = ({
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

export default CellName;
