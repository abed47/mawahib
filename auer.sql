SELECT 
p.id as participation_id, 
p.channel_id as channel_id, 
s.id as submission_id,
v.id as video_id,
(SELECT COUNT(votes.id) FROM votes WHERE submission_id = s.id) as votes,
(SELECT COUNT(views.id) from views WHERE video_id = s.id) as views
from participations p
LEFT JOIN submissions s ON s.participation_id = p.id
LEFT JOIN videos v ON s.video_id = v.id
WHERE p.knocked_out_stage IS NULL AND participation_id NOT IN(5,2,1)
ORDER BY votes ASC, views ASC
LIMIT 5
