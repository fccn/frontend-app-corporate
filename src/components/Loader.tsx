import { useIntl } from '@edx/frontend-platform/i18n';
import { Spinner } from '@openedx/paragon';
import messages from './messages';

interface LoaderProps {
  /**
   * Whether to display the loader as a full-page overlay
   */
  fullPage?: boolean;
  /**
   * Whether to display a small spinner
   */
  small?: boolean;
  /**
   * Optional text to display below the spinner
   */
  text?: string;
  /**
   * Additional CSS class name
   */
  className?: string;
}

const Loader = ({
  fullPage = false,
  small = false,
  text,
  className = '',
}: LoaderProps) => {
  const intl = useIntl();
  const loaderContent = (
    <div className={`d-flex flex-column align-items-center justify-content-center ${className}`}>
      <Spinner
        animation="border"
        size={small ? 'sm' : undefined}
        screenReaderText={intl.formatMessage(messages['corporate.spinner.loading'])}
        variant="primary"
      />
      {text && (
        <div className="mt-2 text-muted">
          {text}
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white"
      >
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
