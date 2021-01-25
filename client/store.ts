import { writable } from 'svelte/store'
import LoadingPage from './components/LoadingPage.svelte'

export const page: any = writable(LoadingPage)
