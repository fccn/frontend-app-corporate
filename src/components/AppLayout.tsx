import { ReactNode } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Container } from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';
import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

import { useNavigate } from '@src/hooks';
import messages from './messages';

type AppLayoutProps = {
  children: ReactNode;
  title?: string;
  withFooter?: boolean;
  withBackButton?: boolean;
  backPath?: string;
};

const AppLayout = ({
  children, title, backPath, withFooter = true, withBackButton = false,
}: AppLayoutProps) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const handleGoBackPath = backPath ? () => navigate(backPath) : () => window.history.back();

  return (
    <>
      <Header mainMenuItems={[]} />
      <main>
        <Container size="xl" className="p-4">
          {withBackButton && (
            <Button variant="link" className="d-flex align-items-center" onClick={handleGoBackPath}>
              <ArrowBack className="mr-3 text-primary" aria-label={intl.formatMessage(messages['corporate.back.button'])} />
              <span className="text-primary">{intl.formatMessage(messages['corporate.back.button'])}</span>
            </Button>
          )}
          {title && <h1 className="my-4">{title}</h1>}
          {children}
        </Container>
      </main>
      {withFooter && <FooterSlot />}
    </>
  );
};

export default AppLayout;
