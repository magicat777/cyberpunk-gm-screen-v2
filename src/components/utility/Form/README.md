# Form Component Library

A comprehensive form component library for the Cyberpunk GM Screen application with full accessibility support and consistent theming.

## Components

### Text Input
Basic text input field with support for various input types (text, email, password, number, etc.)

```tsx
import { TextInput } from '@/components/utility/Form';

<TextInput
  label="Character Name"
  value={name}
  onChange={setName}
  placeholder="Enter name"
  required
  error={errors.name}
  helperText="Choose a memorable street name"
/>
```

### Text Area
Multi-line text input for longer content

```tsx
<TextArea
  label="Background Story"
  value={story}
  onChange={setStory}
  rows={6}
  maxLength={500}
  helperText="Describe your character's origin"
/>
```

### Select
Dropdown selection with optional grouping

```tsx
<Select
  label="Character Class"
  value={selectedClass}
  onChange={setSelectedClass}
  options={[
    { value: 'solo', label: 'Solo' },
    { value: 'netrunner', label: 'Netrunner' },
    { value: 'fixer', label: 'Fixer' }
  ]}
  placeholder="Choose a class"
/>
```

### Checkbox
Single checkbox input

```tsx
<Checkbox
  label="Accept terms and conditions"
  checked={accepted}
  onChange={setAccepted}
  required
/>
```

### Radio Group
Multiple choice selection

```tsx
<RadioGroup
  label="Preferred Weapon Type"
  value={weaponType}
  onChange={setWeaponType}
  options={[
    { value: 'melee', label: 'Melee' },
    { value: 'ranged', label: 'Ranged' },
    { value: 'smart', label: 'Smart Weapons' }
  ]}
  orientation="horizontal"
/>
```

### Switch
Toggle switch for on/off states

```tsx
<Switch
  label="Enable cyberware"
  checked={cyberwareEnabled}
  onChange={setCyberwareEnabled}
/>
```

### Button
Action buttons with multiple variants and states

```tsx
<Button 
  variant="primary" 
  onClick={handleSubmit}
  loading={isSubmitting}
>
  Save Character
</Button>

<Button 
  variant="secondary"
  icon={<Icon name="dice-d20" />}
  onClick={rollDice}
>
  Roll Initiative
</Button>
```

### Form Wrapper
Container for form elements with submission handling

```tsx
<Form onSubmit={handleFormSubmit}>
  <TextInput label="Email" value={email} onChange={setEmail} />
  <TextInput label="Password" type="password" value={password} onChange={setPassword} />
  <Button type="submit" variant="primary">Login</Button>
</Form>
```

### Form Field
Wrapper for custom form controls

```tsx
<FormField 
  label="Custom Control" 
  error={error}
  helperText="Additional information"
>
  <YourCustomComponent />
</FormField>
```

## Common Props

Most form components share these common props:
- `label`: Field label text
- `error`: Error message to display
- `helperText`: Helper text for additional context
- `disabled`: Disable the input
- `required`: Mark field as required
- `className`: Additional CSS classes
- `fullWidth`: Make input full width

## Accessibility Features

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly labels and descriptions
- Error announcements
- Focus management
- Color contrast compliance

## Theming

All components integrate with the Cyberpunk theme system:
- Automatic dark/light mode support
- High contrast mode compatibility
- Customizable through CSS variables
- Consistent spacing and typography

## Validation

Components provide visual and semantic validation states:
- Error styling and messages
- Required field indicators
- ARIA invalid states
- Helper text for guidance

## Examples

### Login Form
```tsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    // Validation and submission logic
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        required
      />
      
      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        required
      />
      
      <Checkbox
        label="Remember me"
        checked={remember}
        onChange={setRemember}
      />
      
      <Button type="submit" variant="primary" fullWidth>
        Sign In
      </Button>
    </Form>
  );
}
```

### Character Creation Form
```tsx
function CharacterForm() {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    background: '',
    stats: {
      strength: 10,
      dexterity: 10,
      intelligence: 10
    }
  });

  return (
    <Form onSubmit={handleSave}>
      <TextInput
        label="Character Name"
        value={formData.name}
        onChange={(value) => updateField('name', value)}
        required
      />
      
      <Select
        label="Character Class"
        value={formData.class}
        onChange={(value) => updateField('class', value)}
        options={characterClasses}
        required
      />
      
      <TextArea
        label="Background"
        value={formData.background}
        onChange={(value) => updateField('background', value)}
        rows={4}
      />
      
      <RadioGroup
        label="Starting Location"
        value={formData.location}
        onChange={(value) => updateField('location', value)}
        options={startingLocations}
      />
      
      <div className="button-group">
        <Button type="submit" variant="primary">
          Create Character
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
```