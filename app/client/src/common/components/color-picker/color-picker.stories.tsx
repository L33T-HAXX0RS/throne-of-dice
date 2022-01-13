import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ColorPicker } from './color-picker.component'

export default {
  title: 'Common/ColorPicker',
  component: ColorPicker,
  argTypes: {
    color: { control: 'color' },
  },
} as ComponentMeta<typeof ColorPicker>

const Template: ComponentStory<typeof ColorPicker> = (args) => (
  <div style={{ width: 200 }}>
    <ColorPicker {...args} />
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  label: 'Pick a color',
}

export const ProvidedColor = Template.bind({})
ProvidedColor.args = {
  label: 'Color',
  color: '#f00',
}
