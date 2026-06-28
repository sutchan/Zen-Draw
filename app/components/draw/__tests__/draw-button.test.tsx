import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import { DrawButton } from '../draw-button'

describe('DrawButton', () => {
  it('renders correctly when not drawing', () => {
    render(<DrawButton isDrawing={false} onClick={() => {}} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('开始抽奖')
  })

  it('renders correctly when drawing', () => {
    render(<DrawButton isDrawing={true} onClick={() => {}} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('停止')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<DrawButton isDrawing={false} onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
