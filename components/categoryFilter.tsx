import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState } from 'recoil'
import { filterState } from '../atoms/modalAtom'
import { Category } from '../interfaces/category.interface'
import { getCategories } from '../services/products.service'

interface CategoryFilterProps {}

const CategoryFilter: React.FC<CategoryFilterProps> = () => {
  const [selectedCategories, setSelectedCategories] =
    useRecoilState(filterState)
  const checkBoxRefs = useRef<HTMLInputElement[]>([])
  const { data: categories, isSuccess: isCategories } = useQuery<Category[]>(
    'categories',
    getCategories
  )

  useEffect(() => {
    checkBoxRefs.current?.map(({ checked, value }) => {
      const category = +value
      if (checked && !selectedCategories.includes(category)) {
        setSelectedCategories([...selectedCategories, category])
      }
    })
  }, [selectedCategories])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = +event.target.value

    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      )
    } else {
      setSelectedCategories(
        [...selectedCategories, category].sort((a, b) => a - b)
      )
    }
  }

  const addToRef = (el: HTMLInputElement) => {
    if (el && !checkBoxRefs.current?.includes(el)) {
      checkBoxRefs.current?.push(el)
    }
  }

  if (!isCategories) return <></>

  return (
    <div className="mt-5 flex items-center space-x-3">
      {categories?.map(({ id, category_name }) => (
        <label key={id} className="flex cursor-pointer items-center space-x-1">
          <input
            type="checkbox"
            className="h-4 w-4"
            value={id}
            onChange={handleChange}
            ref={addToRef}
          />
          <span className="text-sm text-gray-600">{category_name}</span>
        </label>
      ))}
    </div>
  )
}

export default CategoryFilter
