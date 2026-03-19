import { screen, fireEvent } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import DownloadReportButton from './DownloadReportButton';

const mockUseDownloadReport = jest.fn();

jest.mock('@src/catalogs/hooks/useDownloadReport', () => ({
  useDownloadReport: (...args: any[]) => mockUseDownloadReport(...args),
}));

describe('DownloadReportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDownloadReport.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it('renders with correct label', () => {
    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
      />,
    );

    expect(screen.getByRole('button', { name: /download report/i })).toBeInTheDocument();
  });

  it('calls mutate on button click', () => {
    const mutateMock = jest.fn();
    mockUseDownloadReport.mockReturnValue({
      mutate: mutateMock,
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
      />,
    );

    const button = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(button);

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isPending is true', () => {
    mockUseDownloadReport.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: true,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
      />,
    );

    const button = screen.getByRole('button', { name: /download report/i });
    expect(button).toBeDisabled();
  });

  it('is not disabled when isPending is false', () => {
    mockUseDownloadReport.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
      />,
    );

    const button = screen.getByRole('button', { name: /download report/i });
    expect(button).not.toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    mockUseDownloadReport.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
        disabled
      />,
    );

    const button = screen.getByRole('button', { name: /download report/i });
    expect(button).toBeDisabled();
  });

  it('passes endpoint and filename to useDownloadReport hook', () => {
    mockUseDownloadReport.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="manage/catalogs/test/learners/"
        filename="learners_report.csv"
      />,
    );

    expect(mockUseDownloadReport).toHaveBeenCalledWith({
      endpoint: 'manage/catalogs/test/learners/',
      filename: 'learners_report.csv',
      successMessage: undefined,
    });
  });

  it('passes successMessage to useDownloadReport hook when provided', () => {
    mockUseDownloadReport.mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
        successMessage="Custom success message"
      />,
    );

    expect(mockUseDownloadReport).toHaveBeenCalledWith({
      endpoint: 'test/endpoint/',
      filename: 'test_report.csv',
      successMessage: 'Custom success message',
    });
  });

  it('does not call mutate when disabled', () => {
    const mutateMock = jest.fn();
    mockUseDownloadReport.mockReturnValue({
      mutate: mutateMock,
      mutateAsync: jest.fn(),
      isPending: true,
    });

    renderWrapper(
      <DownloadReportButton
        endpoint="test/endpoint/"
        filename="test_report.csv"
      />,
    );

    const button = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(button);

    expect(mutateMock).not.toHaveBeenCalled();
  });
});
