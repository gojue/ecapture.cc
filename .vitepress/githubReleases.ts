export const fetchReleaseTag = () => {
    const isZh = window.location.href.includes('/zh/')
    const baseUrl = isZh 
        ? 'https://image.cnxct.com/ecapture/releases/latest'
        : 'https://api.github.com/repos/gojue/ecapture/releases/latest'
    
    return fetch(baseUrl)
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