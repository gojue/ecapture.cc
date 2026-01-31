export const fetchReleaseTag = () => {
    const isZh = window.location.href.includes('/zh/')
    const baseUrl = isZh 
        ? 'https://image.cnxct.com/ecapture/releases?per_page=5'
        : 'https://api.github.com/repos/gojue/ecapture/releases?per_page=5'

    return fetch(baseUrl)
        .then((res) => res.json())
        .then((releases) => {
            if (!releases || !Array.isArray(releases) || releases.length === 0) return

            // Get the latest release tag for the download button
            const latestTag = releases[0].tag_name ?? ''
            if (!latestTag) return

            const tagLineParagraph = document.querySelector('#github_download')
            if (!tagLineParagraph) return

            const docsReleaseTagSpan = document.createElement('samp')
            docsReleaseTagSpan.classList.add('docs-github-release-tag')
            docsReleaseTagSpan.innerText = latestTag
            tagLineParagraph.appendChild(docsReleaseTagSpan)
        })
        .catch(error => {
            console.error('Failed to fetch releases:', error)
        })
}

