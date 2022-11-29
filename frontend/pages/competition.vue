<template>
    <div>
        <Banner1 />
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    components: {
        Banner1: () => import("@/components/custom/banner/Banner1"),
    }
}
</script>