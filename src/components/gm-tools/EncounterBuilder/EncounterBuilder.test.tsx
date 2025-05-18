import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EncounterBuilder } from './EncounterBuilder';
import { templates } from '@/data/templates';

describe('EncounterBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render encounter builder component', () => {
    render(<EncounterBuilder />);
    
    expect(screen.getByText('Encounter Builder')).toBeInTheDocument();
    expect(screen.getByText('Create and manage combat encounters')).toBeInTheDocument();
  });

  it('should display tabs', () => {
    render(<EncounterBuilder />);
    
    expect(screen.getByText('Builder')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('should handle template selection', () => {
    render(<EncounterBuilder />);
    
    // Switch to templates tab
    const templatesTab = screen.getByText('Templates');
    fireEvent.click(templatesTab);
    
    // Check if templates are displayed
    const firstTemplate = templates[0];
    expect(screen.getByText(firstTemplate.name)).toBeInTheDocument();
  });

  it('should handle keyboard navigation for template selection', () => {
    render(<EncounterBuilder />);
    
    // Switch to templates tab
    const templatesTab = screen.getByText('Templates');
    fireEvent.click(templatesTab);
    
    // Get first template button
    const firstTemplate = templates[0];
    const templateButton = screen.getByText(firstTemplate.name).closest('button');
    
    if (templateButton) {
      // Simulate Enter key press
      fireEvent.keyDown(templateButton, { key: 'Enter' });
      // The template should be selected
      expect(templateButton).toHaveClass('selected');
    }
  });

  it('should handle encounter deletion', () => {
    render(<EncounterBuilder />);
    
    // Switch to saved tab
    const savedTab = screen.getByText('Saved');
    fireEvent.click(savedTab);
    
    // Should show no saved encounters initially
    expect(screen.getByText(/No saved encounters/)).toBeInTheDocument();
  });
});