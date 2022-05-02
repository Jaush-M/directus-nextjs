export interface Product {
  id: string
  product_name: string
  product_image: ProductImage
  product_categories: ProductCategory[]
  show_sizes: boolean | null
  show_colors: boolean | null
  available_colors: AvailableColor[]
  available_sizes: AvailableSize[]
  price: string
  slug: string
}

export interface AvailableSize {
  product_sizes_id: ProductSizesID
}

export interface ProductSizesID {
  id: string
  short_title: string
  long_title: string
}

export interface AvailableColor {
  product_colors_id: ProductColorsID
}

export interface ProductColorsID {
  id: string
  color_name: string
  color_value: string
}

export interface ProductCategory {
  categories_id: CategoriesID
}

export interface CategoriesID {
  id: string
  category_name: string
  slug: string
}

export interface ProductImage {
  id: string
}
