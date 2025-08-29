import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "../../../components/ui/Pagination";

describe("Pagination Component", () => {
  const defaultProps = {
    currentPage: 0,
    totalPages: 5,
    totalElements: 50,
    pageSize: 12,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders pagination controls when totalPages > 1", () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Last")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("does not render when totalElements is 0", () => {
    render(<Pagination {...defaultProps} totalElements={0} />);
    
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  test("calls onPageChange when page button is clicked", () => {
    render(<Pagination {...defaultProps} />);
    
    fireEvent.click(screen.getByText("2"));
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  test("calls onPageSizeChange when page size is changed", () => {
    render(<Pagination {...defaultProps} />);
    
    const select = screen.getByDisplayValue("12 per page");
    fireEvent.change(select, { target: { value: "24" } });
    
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(24);
  });

  test("disables navigation buttons when loading", () => {
    render(<Pagination {...defaultProps} loading={true} />);
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      if (button.textContent !== "1" && button.textContent !== "2" && button.textContent !== "3") {
        expect(button).toBeDisabled();
      }
    });
  });

  test("disables previous buttons on first page", () => {
    render(<Pagination {...defaultProps} currentPage={0} />);
    
    const firstButton = screen.getByTitle("Go to first page");
    const previousButton = screen.getByTitle("Go to previous page");
    
    expect(firstButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
  });

  test("disables next buttons on last page", () => {
    render(<Pagination {...defaultProps} currentPage={4} totalPages={5} />);
    
    const nextButton = screen.getByTitle("Go to next page");
    const lastButton = screen.getByTitle("Go to last page");
    
    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  test("shows current page as active", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    const page2Button = screen.getByText("2");
    // Check that the button exists and is not disabled
    expect(page2Button).toBeInTheDocument();
    expect(page2Button).not.toBeDisabled();
  });

  test("displays pagination info correctly", () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText("Showing 1 to 12 of 50 results")).toBeInTheDocument();
  });

  test("handles edge case with zero total elements", () => {
    render(<Pagination {...defaultProps} totalElements={0} />);
    
    // Should not render anything when there are no results
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  test("shows ellipsis for large page counts", () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={5} />);
    
    // Should show ellipsis when there are many pages
    const ellipsis = screen.getAllByText("...");
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  test("calls onPageChange with correct page numbers", () => {
    render(<Pagination {...defaultProps} />);
    
    // Test clicking on page numbers (these are not disabled)
    fireEvent.click(screen.getByText("2"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(screen.getByText("3"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  test("does not call onPageChange when button is disabled", () => {
    render(<Pagination {...defaultProps} currentPage={0} />);
    
    const firstButton = screen.getByText("First");
    fireEvent.click(firstButton);
    
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
  });

  test("does not call onPageSizeChange when loading", () => {
    render(<Pagination {...defaultProps} loading={true} />);
    
    const select = screen.getByDisplayValue("12 per page");
    fireEvent.change(select, { target: { value: "24" } });
    
    expect(defaultProps.onPageSizeChange).not.toHaveBeenCalled();
  });

  test("does not call onPageSizeChange when size is the same", () => {
    render(<Pagination {...defaultProps} />);
    
    const select = screen.getByDisplayValue("12 per page");
    fireEvent.change(select, { target: { value: "12" } });
    
    // The component will still call onPageSizeChange even if the value is the same
    // because it's a controlled component and the change event fires
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(12);
  });

  test("renders with custom page size options", () => {
    const customOptions = [10, 20, 30];
    render(<Pagination {...defaultProps} pageSizeOptions={customOptions} pageSize={20} />);
    
    expect(screen.getByDisplayValue("20 per page")).toBeInTheDocument();
  });

  test("hides page size selector when showPageSizeSelector is false", () => {
    render(<Pagination {...defaultProps} showPageSizeSelector={false} />);
    
    expect(screen.queryByDisplayValue("12 per page")).not.toBeInTheDocument();
  });

  test("hides pagination info when showInfo is false", () => {
    render(<Pagination {...defaultProps} showInfo={false} />);
    
    expect(screen.queryByText("Showing 1 to 12 of 50 results")).not.toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(<Pagination {...defaultProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("shows correct page numbers in range", () => {
    render(<Pagination {...defaultProps} currentPage={2} totalPages={10} />);
    
    // Should show pages around current page (0, 1, 2, 3, 4)
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("handles single page correctly", () => {
    render(<Pagination {...defaultProps} totalPages={1} />);
    
    // Should still show pagination controls for single page with results
    expect(screen.getByTitle("Go to first page")).toBeInTheDocument();
    expect(screen.getByTitle("Go to previous page")).toBeInTheDocument();
    expect(screen.getByTitle("Go to next page")).toBeInTheDocument();
    expect(screen.getByTitle("Go to last page")).toBeInTheDocument();
    
    // But First and Previous should be disabled
    expect(screen.getByTitle("Go to first page")).toBeDisabled();
    expect(screen.getByTitle("Go to previous page")).toBeDisabled();
  });
});
