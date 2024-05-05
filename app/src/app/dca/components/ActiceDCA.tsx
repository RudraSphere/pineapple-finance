import { getTokenFromAddress } from '@/utils/common'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { IDCA } from '../types'

interface ActiveDCAProps {
  userActiveOrders: IDCA[]
}

const ActiveDCA: React.FC<ActiveDCAProps> = ({ userActiveOrders }) => {
  return (
    <>
      {(userActiveOrders as any)?.length > 0 ? (
        <div className='max-h-[37rem] flex-1 overflow-y-scroll rounded-lg bg-slate-800 p-5 text-white shadow-lg'>
          <h2 className='mb-4 text-2xl font-bold text-white'>Your DCA Orders:</h2>
          {(userActiveOrders as any).map((order, index) => (
            <div key={index} className='mb-4 rounded-lg bg-slate-700 p-4 shadow-lg'>
              <div className='grid grid-cols-2 gap-2 text-white'>
                <p>
                  From Token:{' '}
                  <span className='font-semibold'>
                    {getTokenFromAddress(order.order.fromToken)?.symbol}
                  </span>
                </p>
                <p>
                  To Token:{' '}
                  <span className='font-semibold'>
                    {getTokenFromAddress(order.order.toToken)?.symbol}
                  </span>
                </p>
                <p>
                  Interval:
                  <span className='font-semibold'>
                    {' '}
                    {BigNumber.from(order.order.interval || '0')
                      .div(60)
                      .toString()}{' '}
                    mins
                  </span>
                </p>
                <p className='text-gray-300'>
                  Next Execution Time:
                  <br />
                  <span className='font-semibold text-white'>
                    {new Date(
                      BigNumber.from(order?.order?.nextExecutionTime || 0).toNumber() * 1000
                    ).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </p>

                <p>
                  Amount:
                  <span className='font-semibold'>
                    {' '}
                    {formatUnits(
                      order.order.totalAmount,
                      getTokenFromAddress(order.order.fromToken)?.decimals || 18
                    )}
                    {getTokenFromAddress(order.order.fromToken)?.symbol}
                  </span>
                </p>
                <p>
                  Orders Placed:{' '}
                  <span className='font-semibold'>
                    {BigNumber.from(order.order.ordersPlaced).toString()}/
                    {BigNumber.from(order.order.orderCount).toString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No active DCA orders found.</p>
      )}
    </>
  )
}

export default ActiveDCA
