local M = {}
local acceleration_max = 15  -- 最大加速多少次

function M.shoot(api)
    api:shootOnce(api:isShootingNeedConsumeAmmo())
    local cache = api:getCachedScriptData()
    if (cache == nil) then
        cache = {
            acceleration_count = 0,
            loaded = 0
        }
    end
    local last_shoot_timestamp = api:getLastShootTimestamp()
    local current_timestamp = api:getCurrentTimestamp()
    local shoot_interval = api:getShootInterval()
    if (current_timestamp - last_shoot_timestamp < shoot_interval + 100) then
        if (cache.acceleration_count < acceleration_max) then
            cache.acceleration_count = cache.acceleration_count + 1
        elseif (cache.acceleration_count == acceleration_max and cache.loaded == 0) then
            print("loaded")
            cache.loaded = 1
            if (api:isReloadingNeedConsumeAmmo()) then
                api:putAmmoInMagazine(api:consumeAmmoFromPlayer(10))
            else
                api:putAmmoInMagazine(10)
            end
        end
        api:adjustShootInterval( - cache.acceleration_count * 2 )
    else
        cache.acceleration_count = 0
        cache.loaded = 0
    end
    api:cacheScriptData(cache)
end

return M