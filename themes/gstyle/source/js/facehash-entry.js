// Entry point for bundling facehash with React
import { Facehash } from 'facehash';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Assign directly to global scope (esbuild IIFE wrapper handles this)
globalThis.Facehash = Facehash;
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;
console.log('Facehash bundle loaded');
