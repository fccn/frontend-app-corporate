import {
  Hyperlink, Image, Truncate, Row,
} from '@openedx/paragon';

interface TableNameProps {
  name: string;
  destination: string;
  image?: null | string;
}

const TableName = ({ name, destination, image = null }: TableNameProps) => (
  <Hyperlink
    className="d-block"
    destination={destination}
    variant="muted"
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

export default TableName;
