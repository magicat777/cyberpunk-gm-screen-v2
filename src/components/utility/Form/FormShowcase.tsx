import React, { useState } from 'react';
import {
  Form,
  FormField,
  TextInput,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Button
} from './index';
import { Icon } from '@/components/utility/Icon';
import styles from './FormShowcase.module.css';

export const FormShowcase: React.FC = () => {
  const [formData, setFormData] = useState({
    characterName: '',
    email: '',
    password: '',
    bio: '',
    characterClass: '',
    weaponType: 'melee',
    acceptTerms: false,
    enableNotifications: false,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const characterClasses = [
    { value: 'solo', label: 'Solo' },
    { value: 'netrunner', label: 'Netrunner' },
    { value: 'techie', label: 'Techie' },
    { value: 'medtech', label: 'Medtech' },
    { value: 'media', label: 'Media' },
    { value: 'cop', label: 'Cop' },
    { value: 'corpo', label: 'Corporate' },
    { value: 'fixer', label: 'Fixer' },
    { value: 'nomad', label: 'Nomad' },
  ];

  const weaponOptions = [
    { value: 'melee', label: 'Melee Weapons' },
    { value: 'ranged', label: 'Ranged Weapons' },
    { value: 'smart', label: 'Smart Weapons' },
    { value: 'tech', label: 'Tech Weapons' },
  ];

  return (
    <div className={styles.showcase}>
      <h2>Form Components Showcase</h2>
      
      <Form onSubmit={handleSubmit}>
        <h3>Text Inputs</h3>
        
        <TextInput
          label="Character Name"
          value={formData.characterName}
          onChange={(value) => updateField('characterName', value)}
          placeholder="Enter your character name"
          required
          helperText="Choose a memorable street name"
        />
        
        <TextInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          placeholder="netrunner@nightcity.nc"
          required
        />
        
        <TextInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => updateField('password', value)}
          placeholder="Enter a secure password"
          required
          error={formData.password.length > 0 && formData.password.length < 8 ? 'Password must be at least 8 characters' : ''}
        />
        
        <h3>Text Area</h3>
        
        <TextArea
          label="Character Biography"
          value={formData.bio}
          onChange={(value) => updateField('bio', value)}
          placeholder="Tell us about your character's background..."
          rows={4}
          maxLength={500}
          helperText="Maximum 500 characters"
        />
        
        <h3>Select</h3>
        
        <Select
          label="Character Class"
          value={formData.characterClass}
          onChange={(value) => updateField('characterClass', value as string)}
          options={characterClasses}
          placeholder="Choose your class"
          required
        />
        
        <h3>Radio Group</h3>
        
        <RadioGroup
          label="Preferred Weapon Type"
          value={formData.weaponType}
          onChange={(value) => updateField('weaponType', value)}
          options={weaponOptions}
          orientation="horizontal"
        />
        
        <h3>Checkbox</h3>
        
        <Checkbox
          label="I accept the terms and conditions"
          checked={formData.acceptTerms}
          onChange={(checked) => updateField('acceptTerms', checked)}
          required
        />
        
        <h3>Switch</h3>
        
        <Switch
          label="Enable notifications"
          checked={formData.enableNotifications}
          onChange={(checked) => updateField('enableNotifications', checked)}
          helperText="Get alerts for new missions and events"
        />
        
        <h3>Buttons</h3>
        
        <div className={styles.buttonGroup}>
          <Button type="submit" variant="primary">
            Create Character
          </Button>
          
          <Button variant="secondary" onClick={() => console.log('Secondary action')}>
            Save Draft
          </Button>
          
          <Button 
            variant="tertiary" 
            icon={<Icon name="undo" />}
            onClick={() => setFormData({
              characterName: '',
              email: '',
              password: '',
              bio: '',
              characterClass: '',
              weaponType: 'melee',
              acceptTerms: false,
              enableNotifications: false,
            })}
          >
            Reset Form
          </Button>
          
          <Button 
            variant="danger"
            icon={<Icon name="close" />}
            onClick={() => console.log('Cancel')}
          >
            Cancel
          </Button>
        </div>
        
        <h3>Button States</h3>
        
        <div className={styles.buttonGroup}>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button icon={<Icon name="save" />}>With Icon</Button>
          <Button icon={<Icon name="save" />} iconPosition="end">Icon End</Button>
          <Button icon={<Icon name="settings" />} />
        </div>
        
        <h3>Form Field Wrapper</h3>
        
        <FormField
          label="Custom Field"
          error="This is an error message"
          helperText="This is helper text"
          required
        >
          <input
            type="text"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
        </FormField>
      </Form>
    </div>
  );
};