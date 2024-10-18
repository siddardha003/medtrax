import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import CategoryCard from 'components/category-card';

import 'swiper/css/bundle';

import {
  ArrowButtonBase,
  ButtonGroupBase,
  NextButtonRadius,
  PrevButtonRadius,
} from 'components/utils/theme';
import ChevronLeft from 'assets/icons/chevron-left';
import ChevronRight from 'assets/icons/chevron-right';
import { forwardRef } from 'react';
interface Props {
  data: any;
}

const breakpoints = {
  600: {
    slidesPerView: 3,
  },
  768: {
    slidesPerView: 4,
  },
  1024: {
    slidesPerView: 5,
  },
  1200: {
    slidesPerView: 6,
  },
  1400: {
    slidesPerView: 8,
  },
  1900: {
    slidesPerView: 10,
  },
};
const Categories = forwardRef(
  ({ data }: Props, ref: React.RefObject<HTMLDivElement>) => {
    return (
      <div className="category pt-8" ref={ref}>
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={10}
          navigation={{
            prevEl: '.swiper-previous-button',
            nextEl: '.swiper-next-button',
          }}
          breakpoints={breakpoints}
        >
          {data?.map((current) => (
            <SwiperSlide key={current.id}>
              <CategoryCard
                id={current.id}
                imageUrl={current.image_icon_url}
                name={current.name}
              />
            </SwiperSlide>
          ))}
          <div className={ButtonGroupBase + ' ' + 'z-10'}>
            <button
              aria-label="prev-button"
              className={
                ArrowButtonBase +
                ' ' +
                PrevButtonRadius +
                ' ' +
                'swiper-previous-button'
              }
            >
              <ChevronLeft height="12px" />
            </button>
            <button
              aria-label="next-button"
              className={
                ArrowButtonBase +
                ' ' +
                NextButtonRadius +
                ' ' +
                'swiper-next-button'
              }
            >
              <ChevronRight height="12px" />
            </button>
          </div>
        </Swiper>
      </div>
    );
  }
);

export default Categories;
