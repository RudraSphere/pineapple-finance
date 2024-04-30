import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { tokenList } from './tokens'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getTokenFromAddress(address: string) {
  return tokenList.find(token => token.address === address)
}

export { cn, getTokenFromAddress }
