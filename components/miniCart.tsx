import { useQuery } from 'react-query'
import { getSession } from '../services/sessions.service'

interface MiniCartProps {}

const MiniCart: React.FC<MiniCartProps> = () => {
  const { data: session, isSuccess } = useQuery('session', getSession)

  if (!session) {
    return (
      <section className="mx-auto max-w-2xl px-4 pt-8 lg:max-w-7xl lg:px-8">
        <div>Your cart is empty</div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl px-4 pt-8 lg:max-w-7xl lg:px-8">
      <table className="table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-2 text-xs text-gray-500">Product name</th>
            <th className="px-6 py-2 text-xs text-gray-500">Size</th>
            <th className="px-6 py-2 text-xs text-gray-500">Color</th>
            <th className="px-6 py-2 text-xs text-gray-500">Quantity</th>
            <th className="px-6 py-2 text-xs text-gray-500">Price</th>
          </tr>
        </thead>
        <tbody>
          {isSuccess &&
            session.temp_order.map((item: any) => (
              <tr key={item?.id}>
                <td className="px-6 py-2 text-center text-sm text-gray-500">
                  {item?.product_name}
                </td>
                <td className="px-6 py-2 text-center text-sm text-gray-500">
                  {item?.size_short_title}
                  {!item?.size_short_title && '-'}
                </td>
                <td className="px-6 py-2 text-center text-sm text-gray-500">
                  {item?.color_value && (
                    <span
                      className="mt-2 inline-block h-4 w-4 rounded-full border-white"
                      style={{ background: item?.color_value }}
                    />
                  )}
                  {!item?.color_value && '-'}
                </td>
                <td className="px-6 py-2 text-center text-sm text-gray-500">
                  {item?.quantity}
                </td>
                <td className="px-6 py-2 text-right text-sm text-gray-500">
                  ${item?.price}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  )
}

export default MiniCart
