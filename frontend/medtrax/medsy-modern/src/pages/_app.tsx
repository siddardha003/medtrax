import { CartProvider } from 'contexts/cart/cart.provider';
import { DrawerProvider } from 'contexts/drawer/drawer.provider';
import { SearchProvider } from 'contexts/search/use-search';
import { CategoryProvider } from 'contexts/category/use-category';
import 'typeface-open-sans';
import 'rc-collapse/assets/index.css';
import 'overlayscrollbars/overlayscrollbars.css';
import 'assets/styles/scrollbar.css';
import 'assets/styles/rc-collapse.css';
import 'assets/styles/index.css';

export default function CustomApp({ Component, pageProps }) {
  return (
    <SearchProvider>
      <CategoryProvider>
        <DrawerProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </DrawerProvider>
      </CategoryProvider>
    </SearchProvider>
  );
}
