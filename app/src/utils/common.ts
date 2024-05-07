import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { tokenList } from './tokens'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getTokenFromAddress(address: string) {
  if (!address) return undefined
  return tokenList.find(token => token.address?.toLowerCase() === address?.toLowerCase())
}

const checkValidNumber = (_number: string): boolean => {
  return /^(\d+(\.\d+)?)$/.test(_number)
}

export { checkValidNumber, cn, getTokenFromAddress }
