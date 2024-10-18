import React, { ReactElement } from 'react';
import Image from 'next/image';
import { useCategory } from 'contexts/category/use-category';
interface Props {
  imageUrl: string;
  name: string;
  id: string;
}

export default function CategoryCard({
  imageUrl,
  name,
  id,
}: Props): ReactElement {
  const { category, setCategory } = useCategory();
  function handleCategoryClick() {
    if (category !== id) {
      setCategory(id);
    } else {
      setCategory('');
    }
  }
  return (
    <div
      className={`p-4 flex flex-col border rounded-md text-center ${
        category === id ? 'border-gray-900' : ' border-gray-300'
      }`}
      onClick={handleCategoryClick}
      role="button"
    >
      <div className="aspect-[2/2] max-w-[120px] mx-auto w-full relative">
        <Image
          src={imageUrl ?? '/'}
          alt={name}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <p className="font-semibold text-gray-900 truncate">{name}</p>
    </div>
  );
}
