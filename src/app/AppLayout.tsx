import { ReactNode, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { Container } from '@openedx/paragon';
import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

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
      <Container size="xl" className="p-4">
        {title && <h1 className="my-4">{title}</h1>}
        {children}
      </Container>

      {withFooter && <FooterSlot />}
    </>
  );
};

export default AppLayout;
