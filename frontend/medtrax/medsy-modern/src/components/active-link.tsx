import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ActiveLink = ({
  children,
  className,
  activeClassName,
  href,
  ...props
}: any) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      {...props}
      href={href}
      className={clsx(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
