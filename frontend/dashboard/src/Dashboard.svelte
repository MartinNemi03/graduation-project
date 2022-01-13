<script>
    import { Route } from 'tinro'; 

    import SlideList from './pages/slides/List.svelte';
    import SlideAdd from './pages/slides/Add.svelte';

    const pages = {
        slides: {
            list: SlideList,
            add: SlideAdd
        } 
    }
</script>

<header class="sticky-top shadow">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a href="/dashboard" class="navbar-brand">Dashboard</a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="slidesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Slides
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="slidesDropdown">
                        <li><a class="dropdown-item" href="/dashboard/slides/list">List all slides</a></li>
                        <li><a class="dropdown-item" href="/dashboard/slides/add">Add a new slide</a></li>
                    </ul>
                </li>
            </ul>
            <div class="d-flex flex-row-reverse">
                <span class="navbar-text">Vítejte, admin!</span>
            </div>
        </div>
    </nav>
</header>

<div class="container">
    <Route path="/dashboard/*">
        <Route path="/">
            <h1>Dashboard</h1>
        </Route>
        <Route path="/slides/*">
            <Route path="/list">
                <SlideList/>
            </Route>
            <Route path="/add">
                <SlideAdd/>
            </Route>
        </Route>
    </Route>
</div>

<style>

</style>