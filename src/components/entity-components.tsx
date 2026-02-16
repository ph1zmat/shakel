'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, AlertCircle, InboxIcon } from 'lucide-react';
import type { ReactNode } from 'react';

// ========================================
// Entity Container
// ========================================

interface EntityContainerProps {
  header: ReactNode;
  search?: ReactNode;
  pagination?: ReactNode;
  children: ReactNode;
}

export const EntityContainer = ({
  header,
  search,
  pagination,
  children,
}: EntityContainerProps) => {
  return (
    <div className="space-y-6">
      {header}
      {search}
      {children}
      {pagination}
    </div>
  );
};

// ========================================
// Entity Header
// ========================================

interface EntityHeaderProps {
  title: string;
  description?: string;
  newButtonHref?: string;
  newButtonLabel?: string;
  onNew?: () => void;
  disabled?: boolean;
  isCreating?: boolean;
}

export const EntityHeader = ({
  title,
  description,
  newButtonHref,
  newButtonLabel = 'Создать',
  onNew,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {(newButtonHref || onNew) && (
        <>
          {newButtonHref ? (
            <Button asChild disabled={disabled}>
              <Link href={newButtonHref}>
                <Plus className="size-4 mr-2" />
                {newButtonLabel}
              </Link>
            </Button>
          ) : (
            <Button onClick={onNew} disabled={disabled || isCreating}>
              {isCreating ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Plus className="size-4 mr-2" />
              )}
              {newButtonLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

// ========================================
// Entity Search
// ========================================

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = 'Поиск...',
}: EntitySearchProps) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="max-w-sm"
    />
  );
};

// ========================================
// Entity List
// ========================================

interface EntityListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  emptyView?: ReactNode;
}

export function EntityList<T>({
  items,
  getKey,
  renderItem,
  emptyView,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return <>{emptyView}</>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// ========================================
// Entity Item
// ========================================

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: ReactNode;
  image?: ReactNode;
  onRemove?: () => void;
  isRemoving?: boolean;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  onRemove,
  isRemoving,
}: EntityItemProps) => {
  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardContent className="flex items-center gap-4 p-4">
        {image}
        <Link href={href} className="flex-1 min-w-0">
          <p className="font-medium truncate">{title}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </Link>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// ========================================
// Entity Pagination
// ========================================

interface EntityPaginationProps {
  disabled?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const EntityPagination = ({
  disabled,
  page,
  totalPages,
  onPageChange,
}: EntityPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} из {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Вперёд
      </Button>
    </div>
  );
};

// ========================================
// Status Views
// ========================================

export const LoadingView = ({ message = 'Загрузка...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
      <Loader2 className="size-8 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export const ErrorView = ({ message = 'Произошла ошибка.' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-destructive gap-3">
      <AlertCircle className="size-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

interface EmptyViewProps {
  message?: string;
  onNew?: () => void;
}

export const EmptyView = ({
  message = 'Ничего не найдено.',
  onNew,
}: EmptyViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
      <InboxIcon className="size-12 opacity-50" />
      <p className="text-sm text-center max-w-md">{message}</p>
      {onNew && (
        <Button onClick={onNew}>
          <Plus className="size-4 mr-2" />
          Создать
        </Button>
      )}
    </div>
  );
};
