/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from 'react'
import { ImageProps } from 'next/image';

const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: ImageProps) {
    const [didError, setDidError] = useState(false)

    const handleError = () => {
        setDidError(true)
    }

    const { src, alt, style, className, ...rest } = props

    return didError ? (
        <div
            className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
            style={style}
        >
            <div className="flex items-center justify-center w-full h-full">
                <img
                    src={ERROR_IMG_SRC}
                    alt="Error loading image"
                    {...rest}
                    style={style}
                    className={className}
                    width={props.width}
                    height={props.height}
                />
            </div>
        </div>
    ) : (
        <img
            alt={alt}
            src={typeof src === 'string' ? src : ''}
            width={props.width}
            height={props.height}
            className={className}
            style={style}
            {...rest}
            onError={handleError}
        />
    )
}
