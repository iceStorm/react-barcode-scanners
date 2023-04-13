import { useEffect, useMemo } from 'react'

import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'

import { CiStar } from 'react-icons/ci'
import { VscIssues } from 'react-icons/vsc'
import { BiGitBranch } from 'react-icons/bi'
import { BsUpcScan } from 'react-icons/bs'

import clsx from 'clsx'
import { format, parseISO } from 'date-fns'

import { BarcodeScannerLib } from '@react-barcode-scanners/shared/data-access/models'

import { getRepoInformation } from './api/github.apis'
import styles from './ScannerCard.module.scss'

export function ScannerCard(props: BarcodeScannerLib) {
  const { path, title, liveDemoUrl, sourceUrl, devStatus } = props

  const {
    data: githubRepoData,
    isLoading: isLoadingGithubRepo,
    error: loadGithubRepoError,
  } = useQuery({
    queryKey: ['github', 'repos/fetch', sourceUrl],
    queryFn: () => getRepoInformation(sourceUrl),
    enabled: Boolean(sourceUrl.startsWith('https://github.com/')),
    onError(err) {
      console.error(err)
    },
  })

  const repoLastActivity = useMemo(() => {
    if (githubRepoData) {
      return format(parseISO(githubRepoData.data.pushed_at), 'dd-MM-yyyy / HH:mm:ss')
    }
  }, [githubRepoData])

  useEffect(() => {
    //
  }, [])

  return (
    <div
      className={clsx(
        'rounded-lg border',
        'w-full lg:max-w-md h-full p-5',
        'bg-white',
        'flex flex-col justify-between'
      )}
    >
      <div>
        <h2 className="font-bold mb-5 text-xl">{title}</h2>

        <div className="flex flex-col gap-5">
          <p className="text-xs">
            <span className="font-medium">Document: </span>
            <a
              className="hover:underline text-blue-500 line-clamp-3"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {sourceUrl}
            </a>
          </p>

          <p className="text-xs">
            <span className="font-medium">Library live demo: </span>
            <a
              className="hover:underline text-blue-500 text-ellipsis line-clamp-3"
              href={liveDemoUrl}
              target="_blank"
              rel="noreferrer"
            >
              {liveDemoUrl}
            </a>
          </p>

          {/* github meta info */}
          {githubRepoData && (
            <section className="text-xs mt-5">
              <p className="font-bold mb-2">Github Metadata:</p>

              <div className={styles.grid_github_meta}>
                <p className={clsx('bg-gray-50 bg-opacity-50', 'border rounded-lg', 'p-3')}>
                  <span className="flex items-center gap-2">
                    <CiStar size={20} className="text-yellow-500" />
                    <span>
                      Stars: <span>{githubRepoData.data.stargazers_count}</span>
                    </span>
                  </span>
                </p>

                <p className={clsx('bg-gray-50 bg-opacity-50', 'border rounded-lg', 'p-3')}>
                  <span className="flex items-center gap-2">
                    <VscIssues size={20} className="text-yellow-500" />
                    <span>
                      Open Issues: <span>{githubRepoData.data.open_issues_count}</span>
                    </span>
                  </span>
                </p>

                <p className={clsx('bg-gray-50 bg-opacity-50', 'border rounded-lg', 'p-3')}>
                  <span className="flex items-center gap-2">
                    <BiGitBranch size={17} className="text-yellow-500" />
                    <span>
                      Last push: <span>{repoLastActivity}</span>
                    </span>
                  </span>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mt-10">
        <section className="mb-3">
          <p className="text-xs font-bold">
            <span className="">Development Status: </span>
            <span
              className={clsx({
                'text-green-600': devStatus === 'Done',
                'text-red-500': devStatus === 'Developing',
              })}
            >
              {devStatus}
            </span>
          </p>
        </section>

        <Link
          to={path || '#'}
          className={clsx(
            'text-xs',
            'p-2 px-5',
            'border rounded-md',
            'hover:bg-gray-100',
            'flex items-center justify-center gap-3'
          )}
        >
          <BsUpcScan size={15} className="text-black" />
          <span>View Implementation</span>
        </Link>
      </div>
    </div>
  )
}
