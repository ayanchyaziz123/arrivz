import { MarketplaceData } from "@/types/listing-components";
import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Truck, 
  Shield, 
  Star,
  Tag,
  Calendar,
  FileCheck,
  ArrowLeftRight,
  MapPin,
  CreditCard
} from 'lucide-react';

interface MarketplaceSectionProps {
  data: MarketplaceData;
  onChange: (data: Partial<MarketplaceData>) => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ data, onChange }) => {
  const update = (field: keyof MarketplaceData, value: any) => {
    onChange({ [field]: value });
  };

  const categories = [
    { value: 'electronics', label: 'Electronics & Tech', icon: '📱' },
    { value: 'furniture', label: 'Furniture & Home', icon: '🪑' },
    { value: 'clothing', label: 'Clothing & Fashion', icon: '👕' },
    { value: 'books', label: 'Books & Media', icon: '📚' },
    { value: 'home_garden', label: 'Home & Garden', icon: '🌱' },
    { value: 'sports', label: 'Sports & Recreation', icon: '⚽' },
    { value: 'vehicles', label: 'Vehicles & Parts', icon: '🚗' },
    { value: 'appliances', label: 'Appliances', icon: '🔌' },
    { value: 'tools', label: 'Tools & Equipment', icon: '🔧' },
    { value: 'toys', label: 'Toys & Games', icon: '🧸' },
    { value: 'musical_instruments', label: 'Musical Instruments', icon: '🎸' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const conditions = [
    { value: 'new', label: 'Brand New', description: 'Never used, in original packaging', color: 'text-green-600' },
    { value: 'like_new', label: 'Like New', description: 'Barely used, excellent condition', color: 'text-green-500' },
    { value: 'excellent', label: 'Excellent', description: 'Minor signs of use, great condition', color: 'text-blue-600' },
    { value: 'good', label: 'Good', description: 'Some wear, fully functional', color: 'text-yellow-600' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear, works well', color: 'text-orange-600' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear, may need repairs', color: 'text-red-600' },
    { value: 'for_parts', label: 'For Parts', description: 'Not working, parts only', color: 'text-gray-600' }
  ];

  const selectedCondition = conditions.find(c => c.value === data.condition);

  return (
    <div className="space-y-8">
      {/* Item Classification */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Item Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              value={data.itemCategory} 
              onChange={(e) => update('itemCategory', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <select 
              value={data.condition} 
              onChange={(e) => update('condition', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
            {selectedCondition && (
              <p className={`mt-2 text-xs ${selectedCondition.color}`}>
                {selectedCondition.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quantity Available
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="number"
                min="1"
                value={data.quantityAvailable}
                onChange={(e) => update('quantityAvailable', Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Tag className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Brand <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={data.brand || ''}
              onChange={(e) => update('brand', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Apple, Samsung, Nike"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Model <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={data.model || ''}
              onChange={(e) => update('model', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., iPhone 15 Pro, Galaxy S24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Year Purchased <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear()}
                value={data.yearPurchased || ''}
                onChange={(e) => update('yearPurchased', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Original Price <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="number"
                step="0.01"
                value={data.originalPrice || ''}
                onChange={(e) => update('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="599.99"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => update('price', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="299.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Currency
              </label>
              <select 
                value={data.currency} 
                onChange={(e) => update('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="price-negotiable"
                checked={data.priceNegotiable}
                onChange={(e) => update('priceNegotiable', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="price-negotiable" className="ml-3 text-sm text-gray-700">
                Price is negotiable
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="accepting-trades"
                checked={data.acceptingTrades}
                onChange={(e) => update('acceptingTrades', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="accepting-trades" className="ml-3 text-sm text-gray-700 flex items-center">
                <ArrowLeftRight className="w-4 h-4 mr-1" />
                Open to trades or exchanges
              </label>
            </div>
          </div>

          {data.acceptingTrades && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                What items would you accept in trade?
              </label>
              <textarea
                value={data.tradePreferences || ''}
                onChange={(e) => update('tradePreferences', e.target.value)}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows={3}
                placeholder="• Similar electronics in good condition&#10;• Professional photography equipment&#10;• Vintage collectibles"
              />
            </div>
          )}
        </div>
      </div>

      {/* Delivery & Authenticity */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Truck className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Delivery Options</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="pickup-available"
                checked={data.pickupAvailable}
                onChange={(e) => update('pickupAvailable', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="pickup-available" className="flex items-center text-sm font-medium text-gray-900">
                  <MapPin className="w-4 h-4 mr-2" />
                  Local Pickup
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Buyer can pick up in person
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="delivery-available"
                checked={data.deliveryAvailable}
                onChange={(e) => update('deliveryAvailable', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="delivery-available" className="flex items-center text-sm font-medium text-gray-900">
                  <Truck className="w-4 h-4 mr-2" />
                  Local Delivery
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  You can deliver locally
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="shipping-available"
                checked={data.shippingAvailable}
                onChange={(e) => update('shippingAvailable', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="shipping-available" className="flex items-center text-sm font-medium text-gray-900">
                  <Package className="w-4 h-4 mr-2" />
                  Shipping
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Can ship nationwide
                </p>
              </div>
            </div>
          </div>
        </div>

        {data.deliveryAvailable && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Delivery Fee (Optional)
            </label>
            <div className="relative max-w-xs">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="number"
                step="0.01"
                value={data.deliveryFee || ''}
                onChange={(e) => update('deliveryFee', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full pl-10 pr-4 py-3 border border-yellow-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="10.00"
              />
            </div>
          </div>
        )}
      </div>

      {/* Authenticity & Documentation */}
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Authenticity & Documentation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="purchase-receipt"
                checked={data.purchaseReceipt}
                onChange={(e) => update('purchaseReceipt', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="purchase-receipt" className="flex items-center text-sm font-medium text-gray-900">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Have Original Receipt
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Proof of purchase available
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="warranty-remaining"
                checked={data.warrantyRemaining}
                onChange={(e) => update('warrantyRemaining', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="warranty-remaining" className="flex items-center text-sm font-medium text-gray-900">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Warranty Still Valid
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Manufacturer warranty active
                </p>
              </div>
            </div>
          </div>
        </div>

        {data.warrantyRemaining && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Warranty Details
            </label>
            <textarea
              value={data.warrantyDetails || ''}
              onChange={(e) => update('warrantyDetails', e.target.value)}
              className="w-full px-4 py-3 border border-green-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={2}
              placeholder="e.g., 2-year manufacturer warranty, expires March 2025"
            />
          </div>
        )}
      </div>

      {/* Listing Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">Marketplace Listing Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Item:</span>
            <span className="font-medium text-blue-900">
              {data.brand && data.model ? `${data.brand} ${data.model}` : 
               data.brand ? data.brand : 
               data.model ? data.model : 
               categories.find(c => c.value === data.itemCategory)?.label || 'Item'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Condition:</span>
            <span className={`font-medium ${selectedCondition?.color || 'text-blue-900'}`}>
              {selectedCondition?.label || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Price:</span>
            <span className="font-medium text-blue-900">
              {data.currency} {data.price?.toLocaleString() || '0'}
              {data.priceNegotiable && ' (Negotiable)'}
              {data.acceptingTrades && ' • Open to Trades'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">Availability:</span>
            <span className="font-medium text-blue-900">
              {data.quantityAvailable} available
              {[
                data.pickupAvailable && 'Pickup',
                data.deliveryAvailable && 'Delivery',
                data.shippingAvailable && 'Shipping'
              ].filter(Boolean).join(' • ') || 'Contact for details'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};