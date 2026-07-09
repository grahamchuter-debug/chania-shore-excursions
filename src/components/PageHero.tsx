import { siteImages, type SiteImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PreloadImage } from "@/components/PreloadImage";
import { imageBaseFromSrc } from "@/lib/responsive-images";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  compact?: boolean;
  image?: SiteImage;
  /** @deprecated Prefer `image` prop */
  imageSrc?: string;
  /** @deprecated Prefer `image` prop */
  imageAlt?: string;
}

export function PageHero({
  title,
  subtitle,
  children,
  compact,
  image,
  imageSrc = siteImages.hero.src,
  imageAlt = siteImages.hero.alt,
}: PageHeroProps) {
  const resolvedImage: SiteImage = image ?? {
    base: imageBaseFromSrc(imageSrc),
    src: imageSrc,
    alt: imageAlt,
  };

  return (
    <section
      className={`relative overflow-hidden text-white ${compact ? "py-14 sm:py-16" : "py-20 sm:py-28"}`}
    >
      <PreloadImage base={resolvedImage.base} role="hero" />
      <ResponsiveImage
        image={resolvedImage}
        role="hero"
        priority
        className="absolute inset-0 block h-full w-full"
        imgClassName="absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
