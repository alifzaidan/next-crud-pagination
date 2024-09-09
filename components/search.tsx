'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IoSearch } from 'react-icons/io5';
import { useDebouncedCallback } from 'use-debounce';

export default function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');

        if (value) {
            params.set('query', value);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex flex-1">
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
                className="w-full border border-gray-200 py-2 pl-10 text-sm outline-2 rounded-sm"
            />
            <IoSearch className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
        </div>
    );
}
