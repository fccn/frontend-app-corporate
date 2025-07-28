import { ReactNode, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { Container } from '@openedx/paragon';
import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

type AppLayoutProps = {
  children: ReactNode;
  title?: string;
  withFooter?: boolean;
};

const AppLayout = ({ children, title, withFooter = true }: AppLayoutProps) => {
  const { authenticatedUser } = useContext<AppContext>(AppContext);
  console.debug(authenticatedUser);
  return (
    <>
      <Header mainMenuItems={[]} />
      <Container size="xl">
        {title && <h1 className="mb-4">{title}</h1>}
        {children}
      </Container>

      {withFooter && <Footer />}
    </>
  );
};

export default AppLayout;
