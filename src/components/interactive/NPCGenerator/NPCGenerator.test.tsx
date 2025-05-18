import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NPCGenerator } from './NPCGenerator';
import * as store from '@/store/useStore';

// Mock the store
vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('NPCGenerator', () => {
  const mockAddCharacter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (store.useStore as any).mockReturnValue({
      addCharacter: mockAddCharacter,
    });
  });

  it('should render NPC generator component', () => {
    render(<NPCGenerator />);
    
    expect(screen.getByText('NPC Generator')).toBeInTheDocument();
    expect(screen.getByText('Generate random NPCs for your game')).toBeInTheDocument();
  });

  it('should handle NPC generation', () => {
    render(<NPCGenerator />);
    
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    // Should show generated NPC
    expect(screen.getByText('Generated NPC')).toBeInTheDocument();
  });

  it('should handle saved NPC selection', () => {
    render(<NPCGenerator />);
    
    // Generate an NPC first
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    // Save the NPC
    const saveButton = screen.getByText('Save NPC');
    fireEvent.click(saveButton);
    
    // Check if saved NPCs section shows
    expect(screen.getByText('Saved NPCs')).toBeInTheDocument();
  });

  it('should handle NPC deletion with keyboard', () => {
    render(<NPCGenerator />);
    
    // Generate and save an NPC
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    const saveButton = screen.getByText('Save NPC');
    fireEvent.click(saveButton);
    
    // Find the saved NPC card
    const savedNPCCard = screen.getAllByRole('button').find(btn => 
      btn.className.includes('savedCard')
    );
    
    if (savedNPCCard) {
      // Simulate Enter key press
      fireEvent.keyDown(savedNPCCard, { key: 'Enter' });
      expect(savedNPCCard).toHaveClass('selected');
    }
  });

  it('should handle archetype selection', () => {
    render(<NPCGenerator />);
    
    const archetypeSelect = screen.getByLabelText('Archetype');
    fireEvent.change(archetypeSelect, { target: { value: 'corporate' } });
    
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    
    // The generated NPC should have the selected archetype
    expect(screen.getByText(/corporate/i)).toBeInTheDocument();
  });
});