import { useIntl } from '@edx/frontend-platform/i18n';
import { Container, Icon } from '@openedx/paragon';
import { Report } from '@openedx/paragon/icons';
import messages from './messages';
import AppLayout from '../AppLayout';

type ErrorPageProps = {
  status: 404 | 403 | 'default';
};

const getMessage = (status) => {
  switch (status) {
    case 404:
      return {
        title: messages['corporate.errorpage.404.title'],
        message: messages['corporate.errorpage.404.message'],
      };
    case 403:
      return {
        title: messages['corporate.errorpage.403.title'],
        message: messages['corporate.errorpage.403.message'],
      };
    default:
      return {
        title: messages['corporate.errorpage.default.title'],
        message: messages['corporate.errorpage.default.message'],
      };
  }
};
const ErrorPage = ({ status }: ErrorPageProps) => {
  const intl = useIntl();
  const { title: titleMsg, message: messageMsg } = getMessage(status);

  return (
    <AppLayout>
      <Container className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
        <article className=" m-auto">
          <h1 className="text-primary display-3 mb-5">
            {intl.formatMessage(titleMsg)}
          </h1>
          <p className="lead mb-4 text-center d-flex align-items-center justify-content-center">
            <Icon src={Report} className="mr-3" /> <span>{intl.formatMessage(messageMsg)}</span>
          </p>
        </article>
      </Container>
    </AppLayout>
  );
};

export default ErrorPage;
