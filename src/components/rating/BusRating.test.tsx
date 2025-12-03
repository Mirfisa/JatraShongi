import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BusRating from './BusRating';

/**
 * Unit tests for BusRating component
 * Tests rendering, interactivity, readonly mode, and size variants
 */
describe('BusRating Component', () => {
    it('should render 5 stars', () => {
        render(<BusRating value={0} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(5);
    });

    it('should display correct number of filled stars based on value', () => {
        const { container } = render(<BusRating value={3} />);
        const stars = container.querySelectorAll('svg');
        
        expect(stars).toHaveLength(5);
        // First 3 stars should be filled (yellow)
        expect(stars[0]).toHaveClass('text-yellow-400');
        expect(stars[1]).toHaveClass('text-yellow-400');
        expect(stars[2]).toHaveClass('text-yellow-400');
        // Last 2 should be empty (slate)
        expect(stars[3]).toHaveClass('text-slate-600');
        expect(stars[4]).toHaveClass('text-slate-600');
    });

    it('should call onChange with correct rating when star is clicked', () => {
        const mockOnChange = vi.fn();
        render(<BusRating value={2} onChange={mockOnChange} />);
        
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[4]); // Click 5th star
        
        expect(mockOnChange).toHaveBeenCalledWith(5);
    });

    it('should update stars on hover in interactive mode', () => {
        const { container } = render(<BusRating value={2} onChange={vi.fn()} />);
        const buttons = screen.getAllByRole('button');
        
        // Hover over 4th star
        fireEvent.mouseEnter(buttons[3]);
        
        const stars = container.querySelectorAll('svg');
        // First 4 stars should be filled on hover
        expect(stars[0]).toHaveClass('text-yellow-400');
        expect(stars[1]).toHaveClass('text-yellow-400');
        expect(stars[2]).toHaveClass('text-yellow-400');
        expect(stars[3]).toHaveClass('text-yellow-400');
        expect(stars[4]).toHaveClass('text-slate-600');
    });

    it('should restore original rating after hover ends', () => {
        const { container } = render(<BusRating value={2} onChange={vi.fn()} />);
        const buttons = screen.getAllByRole('button');
        
        // Hover over 4th star
        fireEvent.mouseEnter(buttons[3]);
        // Then leave
        fireEvent.mouseLeave(buttons[3]);
        
        const stars = container.querySelectorAll('svg');
        // Should show original value (2 stars)
        expect(stars[0]).toHaveClass('text-yellow-400');
        expect(stars[1]).toHaveClass('text-yellow-400');
        expect(stars[2]).toHaveClass('text-slate-600');
        expect(stars[3]).toHaveClass('text-slate-600');
        expect(stars[4]).toHaveClass('text-slate-600');
    });

    it('should not call onChange when readonly is true', () => {
        const mockOnChange = vi.fn();
        render(<BusRating value={3} onChange={mockOnChange} readonly={true} />);
        
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[4]); // Try to click
        
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should disable buttons in readonly mode', () => {
        render(<BusRating value={3} readonly={true} />);
        const buttons = screen.getAllByRole('button');
        
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    it('should have cursor-default in readonly mode', () => {
        render(<BusRating value={3} readonly={true} />);
        const buttons = screen.getAllByRole('button');
        
        buttons.forEach(button => {
            expect(button).toHaveClass('cursor-default');
        });
    });

    it('should have cursor-pointer in interactive mode', () => {
        render(<BusRating value={3} onChange={vi.fn()} />);
        const buttons = screen.getAllByRole('button');
        
        buttons.forEach(button => {
            expect(button).toHaveClass('cursor-pointer');
        });
    });

    it('should support small size variant', () => {
        const { container } = render(<BusRating value={2} size="sm" />);
        const stars = container.querySelectorAll('svg');
        
        stars.forEach(star => {
            expect(star).toHaveClass('h-4', 'w-4');
        });
    });

    it('should support medium size variant (default)', () => {
        const { container } = render(<BusRating value={2} />);
        const stars = container.querySelectorAll('svg');
        
        stars.forEach(star => {
            expect(star).toHaveClass('h-6', 'w-6');
        });
    });

    it('should support large size variant', () => {
        const { container } = render(<BusRating value={2} size="lg" />);
        const stars = container.querySelectorAll('svg');
        
        stars.forEach(star => {
            expect(star).toHaveClass('h-8', 'w-8');
        });
    });

    it('should handle 0 rating (no stars filled)', () => {
        const { container } = render(<BusRating value={0} />);
        const stars = container.querySelectorAll('svg');
        
        stars.forEach(star => {
            expect(star).toHaveClass('text-slate-600');
        });
    });

    it('should handle 5 rating (all stars filled)', () => {
        const { container } = render(<BusRating value={5} />);
        const stars = container.querySelectorAll('svg');
        
        stars.forEach(star => {
            expect(star).toHaveClass('text-yellow-400');
        });
    });

    it('should call onChange with correct star on each click', () => {
        const mockOnChange = vi.fn();
        render(<BusRating value={0} onChange={mockOnChange} />);
        
        const buttons = screen.getAllByRole('button');
        
        fireEvent.click(buttons[0]); // Click star 1
        expect(mockOnChange).toHaveBeenCalledWith(1);
        
        fireEvent.click(buttons[1]); // Click star 2
        expect(mockOnChange).toHaveBeenCalledWith(2);
        
        fireEvent.click(buttons[2]); // Click star 3
        expect(mockOnChange).toHaveBeenCalledWith(3);
    });

    it('should not hover-preview in readonly mode', () => {
        const { container } = render(<BusRating value={2} readonly={true} />);
        const buttons = screen.getAllByRole('button');
        
        // Try to hover over 4th star
        fireEvent.mouseEnter(buttons[3]);
        
        const stars = container.querySelectorAll('svg');
        // Should still show original value (2 stars), no hover effect
        expect(stars[0]).toHaveClass('text-yellow-400');
        expect(stars[1]).toHaveClass('text-yellow-400');
        expect(stars[2]).toHaveClass('text-slate-600');
    });
});
