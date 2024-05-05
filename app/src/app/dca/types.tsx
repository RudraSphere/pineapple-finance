interface IDCA {
  order: {
    fromToken: string
    toToken: string
    interval: string
    nextExecutionTime: string
    totalAmount: string
    ordersPlaced: string
    orderCount: string
  }
}

export type { IDCA }
