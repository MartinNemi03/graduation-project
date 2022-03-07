<script>
    import { onMount } from 'svelte';
    import { toastSuccess, toastError } from '../../public/toast';
    import NewsDragList from '../components/NewsDragList.svelte';

    let ready = false;
    let error = false;

    let rawNews = [];
    let parsedNews = [];
    let newsList = [];

    let serverCache = {
        newsList: []
    };

    const catchError = (err, resetQueue = false) => {
        error = true;
        toastError("Nastala chyba!");
        if (err) console.error(err);
        if (resetQueue)
            newsList = serverCache.newsList;
    };

    const randomId = () => {
        return Math.floor(Math.random() * 133742069);
    };

    const getRawNews = async () => {
        return new Promise((resolve) => {
            fetch('../../api/news/raw', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            }).then((req) => {
                if (req.status !== 200) catchError(req)
                else req.json().then((res) => {
                    if (res.success === false) catchError(res)
                    else rawNews = res.raw;
                    resolve();
                });
            }).catch(catchError);
        });
    };

    const getParsedNews = async () => {
        return new Promise((resolve) => {
            fetch('../../api/news/parsed', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            }).then((req) => {
                if (req.status !== 200) catchError(req);
                else req.json().then((res) => {
                    if (res.success === false) catchError(res)
                    else parsedNews = res.parsed;
                    resolve();
                });
            }).catch(catchError);
        });
    };

    const processNews = () => {
        return new Promise((resolve) => {
            newsList = [];

            for (let i = 0; i < rawNews.length; i++)
                newsList[i] = {
                    id: randomId(),
                    raw: rawNews[i]
                };

            for (let i = 0; i < parsedNews.length; i++)
                newsList[i].parsed = parsedNews[i];

            resolve();
        });
    };

    let newsField = "";
    const addNews = () => {
        if (newsField === "") return toastError("News field is empty.");
        newsList.push({ id: randomId(), raw: newsField });
        updateNews(newsList);
    };

    const removeNews = (id) => {
        for (let i = 0; i < newsList.length; i++)
            if (newsList[i].id === id) newsList.splice(i, 1);
        updateNews(newsList);
    };

    const updateNews = (newNews) => {
        ready = false;
        console.log(newNews);
        let newRawNews = [];

        for (let i = 0; i < newNews.length; i++) 
            newRawNews[i] = newNews[i].raw;

        fetch('../../api/news/update', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(newRawNews)
        }).then((req) => {
            if (req.status !== 200) catchError(req, true);
            else req.json().then(async (res) => {
                if (res.success === false) catchError(res, true);
                else {
                    rawNews = res.raw;
                    parsedNews = res.parsed;
                    await processNews();

                    toastSuccess(`News were updated!`);
                }

                ready = true;
            });
        }).catch(catchError);
    };

    const getAll = async () => {
        ready = false;

        await getRawNews();
        await getParsedNews();
        await processNews();

        ready = true;
    };

    onMount(() => {
        getAll();
    });
</script>

<div id="content">
    {#if error}
        <div class="d-flex justify-content-center m-3">
            <h3>An error has occured.</h3>
        </div>
    {/if}

    {#if ready}
        <div class="row justify-content-lg-center">
            <div class="col-lg-8 mt-3">
                <NewsDragList items={newsList} onDrop={updateNews} onDelete={removeNews}/>
            </div>
        </div>
        <form class="row justify-content-lg-center m-3">
            <div class="col-lg-8">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" name="news-field" id="news-field" placeholder="Write your news here.." bind:value={newsField}>
                    <button type="button" class="btn btn-primary" on:click={addNews}>Add</button>
                </div>
            </div>
        </form >
    {:else}
        <div class="d-flex justify-content-center m-5">
            <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    {/if}
</div>