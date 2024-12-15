export const fetchReleaseTag = () => {
    return fetch('/assets/releases/latest')
        .then((res) => res.json())
        .then((json) => json.tag_name ?? '')
        .then(releaseTag => {
            if (!releaseTag) return
            const tagLineParagragh = document.querySelector('#github_download')
            const docsReleaseTagSpan = document.createElement('samp')
            docsReleaseTagSpan.classList.add('docs-github-release-tag')
            docsReleaseTagSpan.innerText = releaseTag
            tagLineParagragh?.appendChild(docsReleaseTagSpan)
        })
}

export const fetchReleaseTagArray = () => {
    return fetch('/assets/releases/index' )
        .then((res) => res.json())
        .then(releaseTag => {
            return releaseTag
        })
}