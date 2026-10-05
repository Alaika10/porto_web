import * as React from 'react';
import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const cardVariants = cva(
  'group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-900 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'p-0',
        featured: 'flex-col md:flex-row',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const cardHover = {
  hover: {
    y: -5,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

const BlogPostCard = React.forwardRef(
  (
    {
      className,
      variant,
      tag,
      date,
      title,
      description,
      imageUrl,
      href,
      readMoreText = 'Read the full article',
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {variant === 'featured' && imageUrl && (
          <div className="relative w-full overflow-hidden md:w-1/2 lg:w-3/5 min-h-[220px]">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        )}

        {/* Featured content */}
        {variant === 'featured' && (
          <div className="flex flex-1 flex-col justify-between p-7 md:p-8">
            <div>
              <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase">
                <span className="rounded-full border border-gray-300 px-2.5 py-0.5 text-gray-600 text-[10px] font-bold tracking-widest">
                  {tag}
                </span>
                <span className="text-gray-400 text-[11px] tracking-wide">{date}</span>
              </div>

              <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 lg:text-2xl">
                {title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>

            <div className="mt-8">
              <Button variant="default" className="group/button rounded-full px-5 py-2.5 text-sm">
                {readMoreText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Default variant — NO image, text only */}
        {variant !== 'featured' && (
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase">
                <span
                  className="rounded-full border border-gray-300 px-2.5 py-0.5 text-gray-600 text-[10px] font-bold tracking-widest"
                >
                  {tag}
                </span>
                <span className="text-gray-400 text-[11px] tracking-wide">{date}</span>
              </div>

              <h3 className="mb-2 text-base font-bold leading-snug text-gray-900">
                {title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{description}</p>
            </div>
          </div>
        )}
      </>
    );

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        variants={cardHover}
        whileHover="hover"
        {...props}
      >
        <a
          href={href}
          className="absolute inset-0 z-10"
          aria-label={`Read more about ${title}`}
        >
          <span className="sr-only">Read More</span>
        </a>
        <div className="relative z-0 flex h-full w-full flex-col md:flex-row">
          {content}
        </div>
      </motion.div>
    );
  }
);

BlogPostCard.displayName = 'BlogPostCard';

export { BlogPostCard };
