import { ReactNode, useContext } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
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
  const { authenticatedUser } = useContext<AppContext>(AppContext);
  console.debug(authenticatedUser);

  const handleGoBackPath = backPath ? () => navigate(backPath) : () => window.history.back();

  return (
    <>
      <Header mainMenuItems={[]} />
      <Container size="xl" className="p-4">
        {withBackButton && (
          <Button variant="link" className="d-flex align-items-center" onClick={handleGoBackPath}>
            <ArrowBack className="mr-3 text-primary-400" />
            <span className="text-primary-400">{intl.formatMessage(messages.backButton)}</span>
          </Button>
        )}
        {title && <h1 className="my-4">{title}</h1>}
        {children}
      </Container>

      {withFooter && <FooterSlot />}
    </>
  );
};

export default AppLayout;
