'use client';

import {
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
export function EntitySearch({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
        className="pl-9"
      />
    </div>
  );
}

export function EntityHeader({
  title,
  description,
  onNew,
  newButtonHref,
  newButtonLabel,
  disabled,
  isCreating,
}: {
  title: string;
  description: string;
  onNew?: () => void;
  newButtonHref?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
}) {
  const showNew = onNew || newButtonHref;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {showNew ? (
        newButtonHref ? (
          <Button asChild disabled={disabled}>
            <Link href={newButtonHref}>
              <PlusIcon />
              {newButtonLabel ?? 'New'}
            </Link>
          </Button>
        ) : (
          <Button onClick={onNew} disabled={disabled || isCreating}>
            {isCreating ? <LoaderIcon className="animate-spin" /> : <PlusIcon />}
            {newButtonLabel ?? 'New'}
          </Button>
        )
      ) : null}
    </div>
  );
}

export function EntityList<T>({
  items,
  getKey,
  renderItem,
  emptyView,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  emptyView: React.ReactNode;
}) {
  if (!items.length) return <>{emptyView}</>;
  return (
    <ItemGroup>
      {items.map((item) => (
        <div key={getKey(item)}>
          {renderItem(item)}
          <Separator />
        </div>
      ))}
    </ItemGroup>
  );
}

export function EntityItem({
  href,
  title,
  subtitle,
  image,
  onRemove,
  isRemoving,
}: {
  href: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  onRemove?: () => void;
  isRemoving?: boolean;
}) {
  return (
    <Item asChild>
      <Link href={href}>
        {image ? <ItemMedia>{image}</ItemMedia> : null}
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          {subtitle ? <ItemDescription>{subtitle}</ItemDescription> : null}
        </ItemContent>
        {onRemove ? (
          <ItemActions>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <Trash2Icon />
              )}
            </Button>
          </ItemActions>
        ) : null}
      </Link>
    </Item>
  );
}

export function EntityPagination({
  disabled,
  page,
  totalPages,
  onPageChange,
}: {
  disabled?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const nextPage = Math.min(page + 1, totalPages);
  const prevPage = Math.max(page - 1, 1);
  return (
    <div className="flex w-full items-center justify-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Go to previous page"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(prevPage)}
      >
        <ChevronLeftIcon />
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Go to next page"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(nextPage)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

export function EntityContainer({
  header,
  search,
  pagination,
  children,
}: {
  header: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="gap-4">
        {header}
        {search ? <div className="w-full">{search}</div> : null}
      </CardHeader>
      <CardContent className="min-h-40">{children}</CardContent>
      {pagination ? <CardFooter>{pagination}</CardFooter> : null}
    </Card>
  );
}

export function LoadingView({ message }: { message: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-muted-foreground">
      <Spinner className="size-6" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-muted-foreground">
      <AlertCircleIcon className="size-6 text-destructive" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyView({
  message,
  onNew,
}: {
  message: string;
  onNew?: () => void;
}) {
  return (
    <Empty>
      <EmptyContent>
        <EmptyHeader>
          <EmptyTitle>Nothing here yet</EmptyTitle>
          <EmptyDescription>{message}</EmptyDescription>
        </EmptyHeader>
        {onNew ? (
          <Button onClick={onNew}>
            <PlusIcon />
            Get started
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}
