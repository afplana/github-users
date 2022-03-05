import { useState, useEffect, createContext, FC } from 'react';
import axios from 'axios';
import { BasicGithubUser, GithubRepo, GithubUser } from '../types';
import { initialUser } from './initialData/initialUser'
import { initialRepos } from './initialData/initialRepos'
import { initialFollowers } from './initialData/initialFollowers'

const rootUrl = 'https://api.github.com';

export type GithubState = {
    githubUser: GithubUser,
    repos: GithubRepo[],
    followers: BasicGithubUser[],
    requests: number,
    error: { show: boolean, msg?: string },
    searchGithubUser: (user: string) => void,
    isLoading: boolean
}

const GithubContext = createContext<GithubState>(
    {
        githubUser: initialUser,
        repos: initialRepos,
        followers: initialFollowers,
        requests: 60,
        error: { show: false, msg: "" },
        searchGithubUser: (user: string) => user,
        isLoading: false,
    }
);

const GithubProvider: FC = ({ children }) => {
    const [githubUser, setGithubUser] = useState<GithubUser>(initialUser)
    const [repos, setRepos] = useState<GithubRepo[]>(initialRepos)
    const [followers, setFollowers] = useState<BasicGithubUser[]>(initialFollowers)

    const [requests, setRequests] = useState<number>(60)
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState<{ show: boolean, msg?: string }>({ show: false, msg: "" })

    const searchGithubUser = async (user: string) => {
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err))
        if (response) {
            setGithubUser(response.data)
            const { login, followers_url } = response.data

            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`)
            ]).then(response => {
                const [repos, followers] = response
                const status = 'fulfilled'
                if (status === repos.status) {
                    setRepos(repos.value.data)
                }
                if (followers.status === status) {
                    setFollowers(followers.value.data)
                }
            }).catch(err => {
                setError({ show: true, msg: err })
            })

        } else {
            toggleError(true, 'There is no user with that username')
        }
        checkRequests()
        setIsLoading(false)
    }

    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({ data }) => {
                let { rate: { remaining } } = data
                setRequests(remaining)
                if (remaining === 0) {
                    toggleError(true, "Sorry, you have exceeded your hourly rate limit!")
                }
            })
            .catch(err => console.log(err))
    }

    function toggleError(show: boolean = false, msg: string = "") {
        setError({ show, msg })
    }

    useEffect(checkRequests, [])

    const state: GithubState = {
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading
    }
    return <GithubContext.Provider value={state}>{children}</GithubContext.Provider>
}


export { GithubProvider, GithubContext };