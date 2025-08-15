
import React from 'react';
import { Card, Button, useWindowSize, Stack } from '@openedx/paragon';

type Stat = {
  title: string;
  value: React.ReactNode;
};

type PageHeaderProps = {
  imageUrl?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  stats?: Stat[];
  actions?: React.ReactNode;
};


const PageHeader: React.FC<PageHeaderProps> = ({
  imageUrl,
  title,
  subtitle,
  stats = [],
  actions,
}) => {
  const { width } = useWindowSize();
  const isSmall = width < 768;
  const isExtraSmall = width < 576;
  return (
    <Card
      className="mb-4"
      orientation={isSmall ? "vertical" : "horizontal"}
    >
      <Card.ImageCap
        src={imageUrl || "https://via.placeholder.com/150"}
        srcAlt="Card image"
      />
      <Card.Body className="row">
        <Card.Section>
          <h4>{title}</h4>
          {subtitle}
        </Card.Section>
        <Card.Section>
          <Stack direction="horizontal" sm gap={3} className="text-center flex-wrap">
            {stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div>
                  <div className='x-small'>{stat.title}</div>
                  <div>{stat.value}</div>
                </div>
                {idx < stats.length - 1 && (
                  <div style={{ borderLeft: '1px solid #e0e0e0', height: '2.5rem', margin: '0 1rem' }} />
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Card.Section>
        {actions && <Card.Section orientation={isExtraSmall ? "horizontal" : "vertical"}>
          {actions}
        </Card.Section>
        }
      </Card.Body>

    </Card>
  );
};

export default PageHeader;
