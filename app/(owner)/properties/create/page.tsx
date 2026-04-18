'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppHeader } from '@/components/app-header'
import { useRouter } from 'next/navigation'

export default function CreatePropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [] as string[],
  })

  const amenitiesList = [
    '🅿️ Parking',
    '🏊 Swimming Pool',
    '🏋️ Gym',
    '🔒 Security',
    '⚡ Power Backup',
    '💧 Water Supply',
    '🌐 WiFi',
    '❄️ AC',
    '🛗 Lift',
    '🎮 Play Area',
  ]

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity)
      })
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = Array.from(files)
    const totalImages = images.length + newImages.length

    if (totalImages > 10) {
      setError('Maximum 10 images allowed')
      return
    }

    // Check file sizes (max 500KB per image for base64)
    const oversizedFiles = newImages.filter(file => file.size > 500000)
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 500KB. Please compress your images.')
      return
    }

    // Add new images
    setImages([...images, ...newImages])

    // Create previews
    newImages.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to add property')
        setIsLoading(false)
        return
      }

      // Convert images to base64 (only if images exist)
      let imageBase64Array: string[] = []
      
      if (images.length > 0) {
        const imagePromises = images.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        })
        imageBase64Array = await Promise.all(imagePromises)
      }

      const response = await fetch('/api/owner/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images: imageBase64Array
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create property')
        setIsLoading(false)
        return
      }

      // Success - redirect to manage properties
      router.push('/properties/manage')
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader transparent />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-white mb-2">➕ Add New Property</h2>
          <p className="text-white/80 dark:text-white/60">List your property and connect with genuine tenants</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20 dark:border-white/10">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📝 Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Property Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Modern 2BHK Apartment in Downtown"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <textarea
                  id="description"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-white/20 bg-white/5 rounded-xl outline-none focus:border-red-500 transition-colors text-white placeholder-white/50 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Property Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  required
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">🏢 Apartment</SelectItem>
                    <SelectItem value="house">🏠 House</SelectItem>
                    <SelectItem value="villa">🏰 Villa</SelectItem>
                    <SelectItem value="studio">🚪 Studio</SelectItem>
                    <SelectItem value="commercial">🏬 Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Property Images */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📸 Property Images</h3>
            <p className="text-white/70 text-sm mb-4">Upload up to 10 images of your property</p>
            
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-white/30 rounded-xl hover:border-red-500 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <span className="text-3xl">📷</span>
                  <div className="text-center">
                    <p className="text-white font-semibold">Click to upload images</p>
                    <p className="text-white/60 text-sm">PNG, JPG up to 500KB each ({images.length}/10)</p>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">📍 Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-white">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-white">State</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="pincode" className="text-white">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">🏠 Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white">Monthly Rent (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="15000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="area" className="text-white">Area (sq ft)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="1200"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="bedrooms" className="text-white">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms" className="text-white">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">✨ Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.amenities.includes(amenity)
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-white/5 border-white/20 text-white hover:border-white/40'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-white/30 text-white hover:bg-white/20"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : '✓ Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
