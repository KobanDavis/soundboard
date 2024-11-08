import { useState, useEffect } from 'react'

function useDebounce<T = any>(intialValue: T, delay: number = 500): [T, typeof setValue, T] {
	const [value, setValue] = useState(intialValue)
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(timer)
	}, [value, delay])

	return [debouncedValue, setValue, value]
}

export default useDebounce
